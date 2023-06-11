import { prisma } from '../../../prisma';

export default defineEventHandler(async () => {
  const count = await prisma.user.count();
  return {
    code: 200,
    data: count,
    msg: '成功'
  };
});