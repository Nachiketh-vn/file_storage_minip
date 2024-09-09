import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import useSocket from "@/hooks/socket/use-socket";
import { Label } from "@radix-ui/react-label";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuCornerDownLeft } from "react-icons/lu";
import { useRef } from "react";
import Markdown from "react-markdown";

type ChatMessages = {
  isQuestion: boolean;
  message: string;
};

async function sendQuestion(question: string) {
  try {
    const response = await fetch("http://localhost:5000/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
  } catch (e) {
    console.log(e);
  }
}

export default function AskAISidebar({
  isSheetOpen,
  setIsSheetOpen,
  selectedFile,
}: {
  isSheetOpen: boolean;
  setIsSheetOpen: Function;
  selectedFile: FileObject | null;
}) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [questionText, setQuestionText] = useState<string>("");
  const [chats, setChats] = useState<ChatMessages[]>([
    { isQuestion: true, message: "What is the file about?" },
    { isQuestion: false, message: "The file is about the history of AI" },
  ]);

  const messageList = useRef<ChatMessages[]>([]);
  const appendToChat = (messages: ChatMessages) => {
    setChats([...chats, messages]);
  };

  const scrollToBottom = () => {
    console.log("scrolling to bottom called");
    if (chatContainerRef.current)
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const { message, operationsCompleted, currentresponse } = useSocket(
    "http://127.0.0.1:5000",
    {},
    appendToChat,
    messageList,
  );
  useEffect(scrollToBottom, [messageList.current, currentresponse, questionText]);

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(e) => {
        setChats([]);
        messageList.current = [];
        setIsSheetOpen(e);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>File: {selectedFile?.name}</SheetTitle>
          <SheetDescription>
            Ask questions about the selected file
            <p>{message}</p>
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col gap-y-3 pb-10">
          <div className="flex-1 overflow-y-scroll ">
            {messageList.current.map((chat) => (
              <Card
                className={clsx(
                  "my-2 w-[90%] text-sm",
                  chat.isQuestion ? "ml-auto" : "mr-auto",
                )}
              >
                <CardContent className="px-4 py-2">
                  <Markdown>{chat.message}</Markdown>
                </CardContent>
              </Card>
            ))}

            {currentresponse && currentresponse != " " && (
              <Card className="my-2 mr-auto w-[90%] text-sm">
                <CardContent className="px-4 py-2">
                  <Markdown>{currentresponse}</Markdown>
                </CardContent>
              </Card>
            )}
            <div ref={chatContainerRef} />
          </div>

          <div className="h-40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (questionText != "") {
                  // appendToChat({ isQuestion: true, message: questionText });
                  messageList.current.push({
                    isQuestion: true,
                    message: questionText,
                  });
                  sendQuestion(questionText);
                  setQuestionText("");
                }
              }}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <Label htmlFor="message" className="sr-only">
                message
              </Label>
              <Textarea
                autoFocus
                id="message"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div
                className={clsx(
                  true ? `flex items-center p-3 pt-0` : "invisible",
                )}
              >
                <Button
                  type="submit"
                  disabled={!operationsCompleted}
                  size="sm"
                  className="ml-auto gap-1.5"
                >
                  Ask Question
                  <LuCornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
