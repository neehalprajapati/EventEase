import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import NotificationList from '../components/notifications/NotificationList';
//import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux'

const Notifications = ({ role }) => {
  //const { userId } = useParams();
  const {userId} = useSelector((state) => state.auth)

  return (
    <Container maxW="container.lg" py={8}>
      <Heading size="lg" mb={6}>
        {role === 'service' ? 'Service Provider Notifications' : 'My Notifications'}
      </Heading>
      <NotificationList 
        userId={userId}
        userType={role}
      />
    </Container>
  );
};

export default Notifications;