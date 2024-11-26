import { ClientTable } from "./components/table/Table";

export default function ClientsPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold">Clientes</h1>
            <div className="mt-10">
                <ClientTable />
            </div>
        </section>
    )
}