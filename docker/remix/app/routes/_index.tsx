import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { prisma } from "utils/db.server";
import { Layout } from "~/components/Layout";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const patientId = Number(formData.get("patientId"));

  if (isNaN(patientId)) {
    return json({ error: "無効なIDです" }, { status: 400 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return json({ error: "該当する患者IDが見つかりません" }, { status: 404 });
  }
  return redirect(`/patient/${patientId}`);
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ようこそ
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              IDを入力して開始してください
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <Form method="post" className="space-y-6">
              <div>
                <label
                  htmlFor="patientId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  患者ID
                </label>
                <input
                  type="number"
                  name="patientId"
                  id="patientId"
                  required
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm px-4 py-2"
                  placeholder="IDを入力"
                />
              </div>

              {actionData?.error && (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {actionData.error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                開始する
              </button>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
