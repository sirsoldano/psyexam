import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "../utils/db.server.ts";

export const loader = async ({ request }) => {
  return json({ exams: [] });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const patientId = Number(formData.get("patientId"));
  
  if (isNaN(patientId)) {
    return json({ error: "Invalid patient ID", exams: [] });
  }

  const exams = await prisma.stackedExam.findMany({
    where: { patientId },
    include: { exam: true },
  });

  return json({ exams });
};

export default function Index() {
  const { exams } = useLoaderData();

  return (
    <div>
      <h1>Patient Exam Lookup</h1>
      <Form method="post">
        <label>
          Patient ID:
          <input type="number" name="patientId" required />
        </label>
        <button type="submit">Search</button>
      </Form>
      <h2>Results</h2>
      <ul>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <li key={exam.id}>{exam.exam.examname}</li>
          ))
        ) : (
          <p>No exams found.</p>
        )}
      </ul>
    </div>
  );
}
