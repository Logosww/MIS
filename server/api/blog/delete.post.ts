import { prisma } from '../../../prisma';

export default defineEventHandler(async event => {
  const body: { id: string } = await readBody(event);
  const { id } = body;
  if(!id) return {
    code: 0,
    data: null,
    msg: '参数错误'
  };

  const deleteBlog = await prisma.blog.delete({
    where:{
      id
    }
  });
  if(!deleteBlog) return {
    code: 2,
    data: null,
    msg: '博客不存在'
  };

  return {
    code: 200,
    data: null,
    msg: '成功'
  };
});
