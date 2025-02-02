import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const transactions = [
  {
    id: 1,
    amount: "$375.53",
    status: "Deposit",
    email: "percy64",
    name: "Howell Hand",
    date: "Mar 3, 2021",
    avatarSrc: "/avatars/01.png",
    progress: 70,
  },
  {
    id: 2,
    amount: "$470.26",
    status: "Payment",
    email: "dare.concepcion",
    name: "Hope Howe",
    date: "Dec 1, 2021",
    avatarSrc: "/avatars/02.png",
    progress: 68,
  },
  {
    id: 3,
    amount: "$971.34",
    status: "Invoice",
    email: "geovanni.kessler",
    name: "Nelson Jerde",
    date: "May 18, 2021",
    avatarSrc: "/avatars/03.png",
    progress: 49,
  },
  {
    id: 4,
    amount: "$374.63",
    status: "Withdrawal",
    email: "macejkovic.dashawn",
    name: "Kim Weimann",
    date: "May 4, 2021",
    avatarSrc: "/avatars/04.png",
    progress: 38,
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9 bg-tertiary">
            <AvatarImage src={transaction.avatarSrc} alt={transaction.name} />
            <AvatarFallback>{transaction.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.name}
            </p>
            <p className="text-sm text-muted-foreground">
              @{transaction.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${
                    transaction.status === "Deposit"
                      ? "bg-emerald-100 text-emerald-700"
                      : transaction.status === "Payment"
                        ? "bg-blue-100 text-blue-700"
                        : transaction.status === "Invoice"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                  }`}
              >
                {transaction.status}
              </span>
              <span>{transaction.amount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
