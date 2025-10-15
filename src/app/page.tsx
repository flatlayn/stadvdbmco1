import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex mt-100 gap-20">
          <div className="flex flex-col gap-5">
              <Select>
                  <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                  </SelectContent>
              </Select>
              <Select>
                  <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                  </SelectContent>
              </Select>
              <Select>
                  <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                  </SelectContent>
              </Select>
              <Button>Submit</Button>
          </div>
          <div>
              <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[100px]">Invoice</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      <TableRow>
                          <TableCell className="font-medium">INV001</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
          </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Technical Report
        </a>
        |
        <p
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          STADVDB MCO1 Group 2
        </p>
      </footer>
    </div>
  );
}
