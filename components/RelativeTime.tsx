import { FunctionComponent, useEffect, useState } from "react";
import { Text, TextProps } from "@chakra-ui/react";

// Time units in miliseconds
type TimeUnit = "hour" | "minute" | "second";

const timeUnits: Record<TimeUnit, number> = {
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const realtiveTimeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const getRelativeTimeMessage = (timeStamp: Date) => {
  const now = new Date();

  const elapsedTimeInMilliseconds = timeStamp.getTime() - now.getTime();

  for (const unit in timeUnits) {
    if (
      Math.abs(elapsedTimeInMilliseconds) > timeUnits[unit as TimeUnit] ||
      unit === "second"
    ) {
      return realtiveTimeFormat.format(
        Math.round(elapsedTimeInMilliseconds / timeUnits[unit as TimeUnit]),
        unit as TimeUnit
      );
    }
  }
};

interface RelativeTimeProps extends TextProps {
  timeStamp: Date;
  messagePrefix: string;
}

const RelativeTime: FunctionComponent<RelativeTimeProps> = ({
  timeStamp,
  messagePrefix,
  ...other
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const elapsedTimeInMilliseconds = timeStamp.getTime() - now.getTime();

    let unit: TimeUnit = "second";

    for (const unitKey in timeUnits) {
      if (
        Math.abs(elapsedTimeInMilliseconds) >= timeUnits[unitKey as TimeUnit]
      ) {
        unit = unitKey as TimeUnit;
      }
    }

    setTimeout(() => {
      setNow(new Date());
    }, timeUnits[unit as TimeUnit]);
  }, [now, setNow, timeStamp]);

  const message = messagePrefix + getRelativeTimeMessage(timeStamp);
  return (
    <Text suppressHydrationWarning {...other}>
      {message}
    </Text>
  );
};

export default RelativeTime;
