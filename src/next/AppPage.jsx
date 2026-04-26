import { BrowserRouter, MemoryRouter } from "react-router-dom";

import ClientApp from "./ClientApp";

function RouterShell({ initialPath, children }) {
  if (typeof window === "undefined") {
    return <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>;
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}

export function createStaticAppPage(initialPath = "/", { ssrRendered = true } = {}) {
  function StaticAppPage() {
    return (
      <RouterShell initialPath={initialPath}>
        <ClientApp ssrRendered={ssrRendered} />
      </RouterShell>
    );
  }

  StaticAppPage.displayName = `StaticAppPage(${initialPath})`;

  return StaticAppPage;
}

export default function AppPage({ initialPath = "/", ssrRendered = true }) {
  return (
    <RouterShell initialPath={initialPath}>
      <ClientApp ssrRendered={ssrRendered} />
    </RouterShell>
  );
}
