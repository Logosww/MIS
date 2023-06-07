import { prisma } from '../../../prisma';

export default defineEventHandler(async event => {
  const body: { id: string; title: string; content: string }
    = await readBody(event);
  const { id, title, content } = body;
  if(!id) return {
    code: 0,
    data: null,
    msg: '参数错误'
  };

  await prisma.blog.update({
    where: {
      id
    },
    data: {
      title,
      content,
      updateTime: new Date()
    }
  });

  return {
    code: 200,
    data: null,
    msg: '成功'
  };
});