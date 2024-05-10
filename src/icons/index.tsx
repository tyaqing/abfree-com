import {
  Calendar,
  Clock,
  Flame,
  Tv2,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  flame: Flame,
  calendar: Calendar,
  tv: Tv2,
  clock: Clock,
  logo: ({ ...props }: LucideProps) => (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" fill="#171717"></rect>
      <path fill-rule="evenodd" clip-rule="evenodd"
            d="M43.7296 61.9069C44.3266 63.0749 44.3129 64.4614 43.6931 65.6175L27.1201 96.5275C26.7629 97.1936 27.2455 98 28.0014 98H45.6633C48.7179 98 51.5058 96.2606 52.8487 93.5171L58.8911 81.1725V80.2078H52.7847C52.5937 80.2074 52.4071 80.1285 52.2484 79.9809C52.0897 79.8333 51.966 79.6236 51.893 79.3784C51.82 79.1332 51.801 78.8634 51.8383 78.6032C51.8756 78.3429 51.9675 78.1039 52.1026 77.9162L62.5907 63.3441C62.9531 62.8407 63.4445 62.558 63.9569 62.558C64.4693 62.558 64.9607 62.8407 65.3231 63.3441L75.8122 77.9162C75.9473 78.104 76.0393 78.3433 76.0765 78.6038C76.1138 78.8643 76.0946 79.1343 76.0213 79.3796C75.9481 79.625 75.8241 79.8346 75.6651 79.982C75.5061 80.1294 75.3192 80.208 75.1281 80.2078H69.0369L75.5515 93.5171C76.8944 96.2606 79.6823 98 82.7369 98H100.405C101.16 98 101.642 97.1965 101.288 96.5304L84.8385 65.6054C84.227 64.4558 84.2134 63.0806 84.8018 61.9191L99.7318 32.452C100.069 31.7868 99.5855 31 98.8398 31H77.0687C76.6818 31 76.3295 31.2233 76.1644 31.5732L64.2001 56.9261L52.3802 31.5774C52.216 31.2252 51.8625 31 51.4739 31H29.5669C28.8196 31 28.3364 31.7897 28.6764 32.4551L43.7296 61.9069Z"
            fill="white"></path>
    </svg>
  ),
  hamburger: ({...props}: LucideProps) => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 20 20"
      aria-hidden="true"
      height="20px"
      width="20px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0px"
      ></path>
    </svg>
  ),
  wrenchSrewdriver: ({...props}: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008z"
      />
    </svg>
  ),
};
