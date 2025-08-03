// app/(tabs)/new.tsx
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NewPostScreen() {
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' } | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const user_name = 'user123'; // 🔁 Replace with dynamic user data

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

  const handlePost = async () => {
    if (!media) return Alert.alert('No media selected');
    setUploading(true);

    try {
      const formData = new FormData();
      const fileField = {
        uri: media.uri,
        name: media.uri.split('/').pop() || 'media',
        type: media.type === 'video' ? 'video/mp4' : 'image/jpeg',
      };
      formData.append(media.type, fileField as any);

      const uploadRes = await fetch(
        `http://192.168.0.100:3000/api/posts/upload-${media.type}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadData = await uploadRes.json();
      const mediaUrl = media.type === 'video' ? uploadData.videoUrl : uploadData.imageUrl;

      const postPayload = {
        user_name,
        type: media.type,
        content: caption,
        videoUrl: media.type === 'video' ? mediaUrl : '',
        imageUrl: media.type === 'image' ? mediaUrl : '',
      };

      await fetch('http://192.168.0.100:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });

      Alert.alert('Success', 'Your post has been uploaded.');
      setMedia(null);
      setCaption('');
      router.push('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
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

      <TextInput
        style={styles.input}
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <LinearGradient colors={['#1db954', '#000']} style={styles.postButton}>
        <TouchableOpacity onPress={handlePost} disabled={uploading}>
          <Text style={styles.postButtonText}>
            {uploading ? 'Uploading...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
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
  mediaButtonText: { fontWeight: '600', color: '#333' },
  preview: { marginVertical: 20, alignItems: 'center' },
  media: { width: '100%', height: 300, borderRadius: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    textAlignVertical: 'top',
    height: 80,
  },
  postButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
