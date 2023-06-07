import { prisma } from '../../../prisma';
import moment from 'moment';

export default defineEventHandler(async () => {
  const blogs = await prisma.blog.findMany({
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
    },
    orderBy: [{ createTime: 'desc' }]
  });
  
  return {
    code: 200,
    data: blogs.map(blog => ({
      ...blog,
      createTime: moment(blog.createTime).format('YYYY-MM-DD h:mm'),
      updateTime: moment(blog.updateTime).format('YYYY-MM-DD h:mm')
    })),
    msg: '成功'
  };
});