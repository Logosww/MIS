import { getServerSession } from '#auth';
import { prisma } from '../../../prisma';
import moment from 'moment';

export default defineEventHandler(async event => {
  const body: { title: string; content: string } = await readBody(event);
  const { uid } = await getServerSession(event);
  if(!uid) return setResponseStatus(event, 401);

  const { title, content } = body;
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      authorId: uid
    },
    select: {
      id: true,
      author: {
        select: {
          name: true,
          username: true,
          image: true
        }
      },
      title: true,
      createTime: true,
      updateTime: true
    }
  });

  return {
    code: 200,
    data: {
      ...blog,
      createTime: moment(blog.createTime).format('YYYY-MM-DD h:mm'),
      updateTime: moment(blog.updateTime).format('YYYY-MM-DD h:mm')
    },
    msg: '成功'
  };
});