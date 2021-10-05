import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchData } from './service';
import Card from './Card';

const Dashboard = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [newStart, setNewStart] = useState(0);
  const [cardsList, setCardsList] = useState([]);

  const observer = useRef();

  //Effect to trigger api on first mount and subsequent newStart value as user scrolls down
  useEffect(() => {
    setIsLoading(true);
    fetchData(newStart).then(response => {
      setCardsList([...cardsList, ...response])
      //If the API is exhausted we don't want to  keep calling it so we set a flag here
      setHasMore(response.length > 0);
      setIsLoading(false);
    }).catch(error => {
      setHasError(true);
      alert(error.message);
    });
  }, [newStart]);

  /*
  Using IntersectionObserver and refference to check if the targert element(the last element of page)
  is in the view or not if it is there we again call the api with updated start position
  */
  const lastItemRef = useCallback((node) => {
    if(isLoading) return;
    /*
    Every time the callback is called we diconnect the previous observer since,
    after the api call we have appended new entries to the list so the last element has changed.
    */
    if(observer.current) observer.current.disconnect();
    // After disconnecting we create a new observer for new last element.
    observer.current = new IntersectionObserver(entries => {
      //Checking if the selected target element is in view and the api is not yet exhausted
      if(entries[0].isIntersecting && hasMore) {
        //The default page size/limit per api call is set to 10
        setNewStart(newStart + 10);
      }
    });
    if(node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  return (
    <div className="cardsContainer">
      {cardsList.map((item, index) => {
        //If it is the last item of the cardList attach the observer target ref to it
        if(cardsList.length === index+1) {
          return <Card key={item.id} item={item} ref={lastItemRef} />
        } else {
          return <Card key={item.id} item={item} />
        }
      })}
      {isLoading && <div>Loading...</div>}
      {hasError && <div>Loading...</div>}
    </div>
  );
};

export default Dashboard;
