import { prisma } from '../../../prisma';

export default defineEventHandler(async event => {
  const body: { id: string } = await readBody(event);
  const { id } = body;
  const deletedUser = await prisma.user.delete({
    where: {
      id
    }
  });

  if(!deletedUser) return {
    code: 0,
    data: null,
    msg: '用户不存在'
  };

  return {
    code: 200,
    data: null,
    msg: '成功'
  };
});