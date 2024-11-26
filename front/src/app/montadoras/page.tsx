import { AutomakerTable } from "./components/table/Table";

export default function ClientsPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold">Montadoras</h1>
            <div className="mt-10">
                <AutomakerTable />
            </div>
        </section>
    )
}