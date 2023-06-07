import { prisma } from '../../../prisma';

export default defineEventHandler(async event => {
  const body: { username: string, password: string } = await readBody(event);
  const { username, password } = body;
  if(!(username && password)) return {
    code: 0,
    data: null,
    msg: '用户名和密码不能为空'
  };

  const user = await prisma.user.create({
    data: {
      username,
      password
    }
  });

  return {
    code: 200,
    data: user.id,
    msg: 'success'
  };
});