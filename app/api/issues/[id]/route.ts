import { issueSchema } from '@/app/validationSchema';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import delay from 'delay';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const validation = issueSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 404 });

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json({ error: 'Invalid issue' }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  delay(2000);
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json({ error: 'Invalid issue' }, { status: 404 });

  await prisma.issue.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({});
}
