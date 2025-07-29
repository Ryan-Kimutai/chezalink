import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NewPostScreen() {
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const router = useRouter();

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera roll access is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const type = asset.type === 'video' ? 'video' : 'image';
      setMedia({ uri: asset.uri, type });
    }
  };

  const handlePost = () => {
    if (!media) return Alert.alert('No media selected');
    Alert.alert('Posted!', 'Your content has been uploaded.');
    setMedia(null);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>

      <TouchableOpacity onPress={pickMedia} style={styles.mediaButton}>
        <Text style={styles.mediaButtonText}>Select Image or Video</Text>
      </TouchableOpacity>

      {media && (
        <View style={styles.preview}>
          {media.type === 'image' ? (
            <Image source={{ uri: media.uri }} style={styles.media} />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              isLooping
            />
          )}
        </View>
      )}

      <TouchableOpacity onPress={handlePost} style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1db954', textAlign: 'center' },
  mediaButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  mediaButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  preview: {
    marginVertical: 20,
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  postButton: {
    backgroundColor: '#1db954',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
