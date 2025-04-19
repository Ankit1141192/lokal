import React, { useEffect, useState, useCallback } from 'react';
import {View,Text,FlatList,StyleSheet,ActivityIndicator,SafeAreaView,StatusBar,TouchableOpacity} from "react-native"

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const data = await response.json();

      if (data.results?.length > 0) {
        setJobs((prev) => [...prev, ...data.results]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ margin: 16 }} size="large" color="#007AFF" />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.center}>
        <Text>No jobs available.</Text>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
       
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.location}>{item.primary_details?.Place || 'Location not specified'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderError()}
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={fetchJobs}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 10 
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
 },
  location: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 4 
 },
  center: { 
    alignItems: 'center', 
    marginTop: 30 
  },
  errorText: { color: 'red', 
    fontSize: 16, 
    marginBottom: 10 
 },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: { 
    color: '#fff' 
 },
});

export default App;
