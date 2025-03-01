import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Layout } from "~/components/Layout";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const patientId = Number(params.id);

  if (isNaN(patientId)) {
    throw new Response("Invalid Patient ID", { status: 400 });
  }

  const stackedExams = await prisma.stackedExam.findMany({
    where: { patientId },
    include: { exam: true },
  });

  return json({ stackedExams, patientId });
};

export default function PatientExams() {
  const { stackedExams, patientId } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        setSearchParams({}, { replace: true });
      }, 3000);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Layout title="心理検査一覧">
      {showMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          提出が完了しました！
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {stackedExams.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stackedExams.map((exam) => (
              <li key={exam.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {exam.exam.examname}
                    </h3>
                  </div>
                  <Link
                    to={`/exam/${exam.exam.id}?patientId=${patientId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    実施する
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            この患者様の検査項目はありません。
          </div>
        )}
      </div>
    </Layout>
  );
}
