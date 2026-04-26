import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("./ClientApp"), {
  ssr: false,
  loading: () => (
    <div id="loading-screen">
      <div className="spinner" />
    </div>
  ),
});

export default function AppPage() {
  return <ClientApp />;
}
