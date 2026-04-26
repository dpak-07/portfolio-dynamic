import { useRouter } from "next/router";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

import ClientApp from "./ClientApp";

export async function getServerSideProps(context) {
  return {
    props: {
      initialPath: context.resolvedUrl || context.req?.url || "/",
      ssrRendered: true,
    },
  };
}

function RouterShell({ initialPath, children }) {
  if (typeof window === "undefined") {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}

export default function AppPage({ initialPath = "/", ssrRendered = false }) {
  const router = useRouter();
  const resolvedPath = initialPath || router.asPath || router.pathname || "/";

  return (
    <RouterShell initialPath={resolvedPath}>
      <ClientApp ssrRendered={ssrRendered} />
    </RouterShell>
  );
}
