import { Circle } from "lucide-react";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Separator } from "~/components/ui/separator";
import { textToColor } from "~/lib/textToColor";
import { GetFungibleResponse } from "~/types/simple-hash/balances";

type Props = {
  balances: GetFungibleResponse[];
};

export const DistributionCard: React.FC<Props> = ({ balances }) => {
  const data = useMemo(
    () =>
      (balances ?? [])
        .map((balance) => {
          const price = balance.queried_wallet_balances.reduce(
            (acc, el) => acc + (el.value_usd_cents ?? 0),
            0
          );

          return {
            price,
            currency: balance.symbol,
            fill: textToColor(balance.symbol ?? ""),
          };
        })
        .filter((el) => el.price > 0)
        .sort((a, b) => b.price - a.price)
        .map((el) => ({
          ...el,
          price: el.price / 100,
        })),
    [balances]
  );

  const totalPrice = data.reduce((acc, el) => acc + el.price, 0);

  const chartConfig = Object.entries(data).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: {
        label: value.currency,
        color: value.fill,
      },
    };
  }, {});

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2 justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square min-h-[250px] max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="price"
                nameKey="currency"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalPrice.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            USD
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <Separator orientation="vertical" />

          <div className="flex flex-col justify-center">
            <ul>
              {data.map((el) => (
                <li
                  key={el.currency}
                  className="flex flex-row gap-2 items-center w-full"
                >
                  <Circle
                    className="h-4 w-4"
                    style={{ fill: el.fill, stroke: "none" }}
                  />
                  <div className="grid grid-cols-2 lg:grid-cols-3 grow">
                    <div>{el.currency}</div>
                    <div className={`lg:col-span-2 text-right `}>
                      {el.price.toLocaleString()} USD
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
