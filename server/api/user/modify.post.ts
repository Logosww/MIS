import { getServerSession } from '#auth';
import { prisma } from '../../../prisma';

import type { Profile } from '../../../composables/use-api';

export default defineEventHandler(async event => {
  const body: Profile & { id?: string } = await readBody(event);
  const { id } = body;
  const uid: string = id ?? (await getServerSession(event)).uid;
  const user = await prisma.user.update({
    where: {
      id: uid
    },
    data: {
      name: body.name,
      image: body.image,
      email: body.email
    }
  });
  if(user) return {
    code: 200,
    data: null,
    msg: '成功'
  }; 
  
  return {
    code: 0,
    data: null,
    msg: '用户不存在'
  };
});