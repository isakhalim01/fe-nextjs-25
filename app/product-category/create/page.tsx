import Layout from "@/components/ui/Layout";
import { TextField } from "@mui/material";


export default function Page() {
  return (
    <Layout>
        <h1 className="text-black text-2xl font-bold">Product-category create </h1>
        <form action=" "className="w-full">
            <div className="grid grid-cols-2 gap-4 my-4">
            <TextField 
            id="standard-Basic" 
            label="standard" 
            variant="standard"
            />
            </div>
        </form>
    </Layout>
  )
}
