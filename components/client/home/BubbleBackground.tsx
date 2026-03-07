export default function BubbleBackground() {
  return (
    <>
      <div className="bubble w-16 h-16 top-32 left-10 animate-float" style={{ animationDelay: "0s", background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(41,98,118,0.3) 100%)" }} />
      <div className="bubble w-10 h-10 top-48 right-20 animate-float" style={{ animationDelay: "0.5s", background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(38,96,117,0.3) 100%)" }} />
      <div className="bubble w-20 h-20 bottom-32 left-1/4 animate-float" style={{ animationDelay: "1s", background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(41,98,118,0.3) 100%)" }} />
      <div className="bubble w-8 h-8 top-1/3 right-1/3 animate-float" style={{ animationDelay: "1.5s", background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(38,96,117,0.3) 100%)" }} />
      <div className="bubble w-12 h-12 bottom-48 right-1/4 animate-float" style={{ animationDelay: "0.3s", background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(41,98,118,0.3) 100%)" }} />
    </>
  );
}