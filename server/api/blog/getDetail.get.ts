import { prisma } from '../../../prisma';
import moment from 'moment';

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { id } = query;
  if(!id || typeof id !== 'string') return {
    code: 0,
    data: null,
    msg: '参数错误'
  };

  const blog = await prisma.blog.findUnique({
    where: {
      id: id as string
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
      content: true,
      createTime: true,
      updateTime: true
    }
  });
  if(!blog) return {
    code: 2,
    data: null,
    msg: '博客不存在'
  };

  return {
    code: 200,
    data: {
      ...blog,
      createTime: moment(blog.createTime).format('YYYY-MM-DD h:mm'),
      updateTime: moment(blog.updateTime).format('YYYY-MM-DD h:mm')
    },
    msg: 'cg'
  };
});