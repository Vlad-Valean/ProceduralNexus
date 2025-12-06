import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      fontWeight: 'bold'
    }}>
      You are logged in 🎉
    </div>
  );
};

export default Dashboard;
