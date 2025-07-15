import type { FastifyInstance } from 'fastify';
import fastifyOAuth2 from '@fastify/oauth2';
const GITHUB_CLIENT_ID = 'Ov23li4dOoZDXV58mEXp';
const GITHUB_CLIENT_SECRET = 'e4a786669fafe2cdae2fc4049f1a735b14d7959e';


export default async function authRoutes(fastify: FastifyInstance) {

  // Regista o plugin OAuth2 com a configuração de cookie explícita
  fastify.register(fastifyOAuth2, {
    name: 'githubOAuth',
    scope: ['read:user', 'user:email'],
    credentials: {
      client: {
        id: GITHUB_CLIENT_ID,
        secret: GITHUB_CLIENT_SECRET,
      },
      auth: fastifyOAuth2.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/auth/github',
    callbackUri: 'http://localhost:3333/auth/github/callback',
    cookie: {
      path: '/',
    }
  });

  fastify.get('/auth/github/callback', async function (request, reply) {
    try {
      const { token } = await this.githubOAuth.getAccessTokenFromAuthorizationCodeFlow(request);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token.access_token}`,
        },
      });
      const githubUser = await githubUserResponse.json();

      // --- LÓGICA DE FALLBACK DE E-MAIL AQUI ---
      let userEmail = githubUser.email;

      // Se o e-mail público for nulo, busca na lista de e-mails do utilizador.
      if (!userEmail) {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${token.access_token}`,
          },
        });
        const emails = await emailsResponse.json();
        
        const primaryEmail = emails.find((email: any) => email.primary && email.verified);
        
        if (!primaryEmail) {
          return reply.code(400).send({ message: 'Não foi possível encontrar um e-mail verificado na sua conta do GitHub.' });
        }
        userEmail = primaryEmail.email;
      }
      // --- FIM DA LÓGICA DE FALLBACK ---

      let user = await fastify.prisma.user.findUnique({
        where: { email: userEmail }, 
      });

      if (!user) {
        user = await fastify.prisma.user.create({
          data: {
            email: userEmail,
            name: githubUser.name,
            avatarUrl: githubUser.avatar_url,
          },
        });
      }

      const jwtToken = fastify.jwt.sign({
        userId: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      });
      
      reply.setCookie('token', jwtToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      }).redirect('http://localhost:8080');

    } catch (err) {
      fastify.log.error(err, 'Erro durante o callback do OAuth');
      reply.redirect('http://localhost:8080?error=auth_failed');
    }
  });

  fastify.get('/auth/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    return request.user;
  });

  fastify.get('/auth/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' }).redirect('http://localhost:8080');
  });
}
