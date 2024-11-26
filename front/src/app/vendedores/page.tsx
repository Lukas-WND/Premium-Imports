import { SellerTable } from "./components/table/Table";

export default function ClientsPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold">Vendedores</h1>
            <div className="mt-10">
                <SellerTable />
            </div>
        </section>
    )
}