import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Card from "./Card";


type Props = {
  options: (typeof challengeOptions.$inferInsert)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferInsert)["type"];
};

const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: Props ) => {
  return (
    <div className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
    )}>
        {options.map((option, i) => (
          <Card 
          key={option.id}
          //@ts-ignore
                id={option.id}
                text={option.text}
                //@ts-ignore
                imageSrc={option.imageSrc}
                shortcut={`${i + 1}`}
                selected={selectedOption === option.id}
                //@ts-ignore
                onclick={() => onSelect(option.id)}
                status={status}
                //@ts-ignore
                audioSrc={option.audioSrc}
                disabled={disabled}
                type={type}
            />
        ))}
    </div>
  )
};

export default Challenge;
