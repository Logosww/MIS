import { prisma } from '../../../prisma';

export default defineEventHandler(async () => {
  const count = await prisma.blog.count();
  return {
    code: 200,
    data: count,
    msg: '成功'
  };
});