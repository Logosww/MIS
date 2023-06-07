import { prisma } from '../../../prisma';

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      image: true
    }
  });
  return {
    code: 200,
    data: users,
    msg: '成功'
  };
});