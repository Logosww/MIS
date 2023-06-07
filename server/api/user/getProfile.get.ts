import { getServerSession } from '#auth';
import { prisma } from '../../../prisma';

export default defineEventHandler(async event => {
  const query = getQuery(event);
  const { id } = query;
  const uid: string = id ?? (await getServerSession(event)).uid;
  const profile = await prisma.user.findUnique({
    where: {
      id: uid
    }
  });
  if(profile) return {
    code: 200,
    data: profile,
    msg: '成功'
  }; 
  
  return {
    code: 0,
    data: null,
    msg: '用户不存在'
  };
});