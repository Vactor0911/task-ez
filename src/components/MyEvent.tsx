const MyEvent = (event: any) => {
  return (
    <div
      className="rbc-event-content"
      id={event.event.id}
      style={{
        backgroundColor: event.event.color,
        color: "black",
        fontWeight: "500",
      }}
    >
      {event.title}
    </div>
  );
};

export default MyEvent;
