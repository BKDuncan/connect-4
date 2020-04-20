import { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

function SocketStore(props) {
  useEffect(() => {
    props.store.initialize();
  }, []);

  useEffect(() => {
    props.store.setupEvents();
    
    return () => {
      props.store.cleanup();
    };

  }, [props.store.socket]);
}

export default inject('store')(observer(SocketStore));