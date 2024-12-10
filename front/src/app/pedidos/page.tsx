import { SaleTable } from "./components/table/Table";

export default function ClientsPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold">Pedidos</h1>
            <div className="mt-10">
                <SaleTable />
            </div>
        </section>
    )
}