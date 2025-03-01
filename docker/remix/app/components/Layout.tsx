import { Link } from "@remix-run/react";

type LayoutProps = {
  children: React.ReactNode;
  showNav?: boolean;
  title?: string;
};

export function Layout({ children, showNav = true, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showNav && (
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center text-gray-900 dark:text-white font-bold text-xl"
                >
                  PsyExam
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}