import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ChatHistoryProvider } from '@/hooks/use-chat-history';

export const metadata: Metadata = {
  title: 'Query Bot',
  description: 'An AI-powered FAQ chatbot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyADIDASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAwQCBQYABwH/xAApEAACAQMDAwQCAwEAAAAAAAABAgMABBEFEiExQQYTUWEiInEjkaGx/8QAGAEBAQEBAQAAAAAAAAAAAAAAAQACAwT/xAAgEQEBAAICAwEBAQEAAAAAAAAAAQIRAxIhMQRBEyJR/9oADAMBAAIRAxEAPwD5Vbxsryyqiuw8qOeKj6107G2uL24ENtG0kh5wOcen1PiuZpWq3WkXXiWpUMw2srDKsOxp/S/ENLsdSGoRWM3i4y4VwqqD1weT8VXbN2T5c/C30nU/04a5cKq3UcUaxY+85kAP4Aya5Gr6TdaPepBcsjCRQ8ciHKup6EV6HpXjDSrPVJ9SNpeXV1OG3ed0UZY5OAAcdetcPxFqa6zqMt0kLRI2Aqsc4AAGeBnpW8bcebll8bE8U3f0J4plxTwK6nMeKeKYKeKAHinisdqcqAcngUAi3c0V1dW0E8sJ/uSRq7L+CRkVd/Srf/APq2p/8AuWX/AMa9W0HwrbaToVrFeQRXF2ybppHRWIZucAnpgYFbf/hGl/8AIQ/+hf8A5rzuOV29XN5vj1p0/iC8tY0igvLuKNPuqk7qo+gBp1/FPiCSMpJq+pOjDBVrp2BHsc17z/4Rpf/ACEP/oX/AOaQ+ErQEgwQkeh8Jef+6sxyuunl8/tSkljleKRkdThlY4IPqDXsel/8QyS+tY1/U1iuZQAxhK5jY+g7qfrx71V/wCENL/5CH/0L/8ANKPBWmsAfBhJ77Imx+VXVzWlxyuPNYvF/h2+0m+luCjGxlkJhmA+HoD2Pse1W8V9B/8ACul/8hD/AOhf/mlPhDSwM+DD/wBEbH8qf5J9nTy+aAU8V9I/8KaT/wAhD/6F/wDmmjwVpmQPChJ7YibP5VS81mnK8H0zXNV0lGSyuHjRvvIRlD9QeK1f+fNa//AFv+tFez2Pg3TJ7aORbYKWHIEKDH5Vo/8KaT/wAhD/6F/wDmqrklJjlYvG9D8T6bpmiWVrPcKksabWUo3Bz64rX/AOfNI/6lf+hv9K2YPBWmyRLILZVBGceEmf8AumrP/hDS/wDkIf8A0L/81S8lmnK8g/580j/qV/6G/wBKD440jHFwvP8Aob/SvX/+ENL/AOQh/wDQv/zQfCVoCQYISOo8Jef+6qea6acrwjWvEFprN8t1NaCJI02RoW8x1HPLMQAT/pUcU/0p4FdVxxR0DxTwKAHininiqfFAD03TdS1SRk06zuLpl++IYy+364HFbUXg/xFNC00elXOwLuc7dpA+hOa6v/AMOn2qR29/cQQrtjQINo7ZIyfzNezJ9xfpXmZ89xvS5MvO3ydpmj3ulSeHqMEkDn2zIMofr0/GocV9LSRpLG0cihkYYZWGQR6GvNPEfhOTTJJL7T1aTT2JZkHLQ/XsU9/TtXRhzuuPLhnhjIpniqcU8V1nMinvBHJNHM8aNLFny3IyVz1x6ZplPFAc5yRkk5PHWnHiiigB4ooopgf/2Q==" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ChatHistoryProvider>
          {children}
        </ChatHistoryProvider>
        <Toaster />
      </body>
    </html>
  );
}
