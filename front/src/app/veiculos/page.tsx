import { ModelTable } from "./components/table/Table";

export default function ModelosPage() {
    return (
        <section>
            <h1 className="text-2xl font-semibold">Veiculos</h1>
            <div className="mt-10">
                <ModelTable />
            </div>
        </section>
    )
}