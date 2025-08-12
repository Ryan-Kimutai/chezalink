// app/(tabs)/new.tsx
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type MediaType = {
  uri: string;
  type: 'image' | 'video';
} | null;

export default function CreatePostScreen() {
  const [media, setMedia] = useState<MediaType>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();
 console.log(userName)
  useEffect(() => {
    const init = async () => {
      const storedUser = await SecureStore.getItemAsync('user');
      let name = '';
    if (storedUser) {
      try {
        name = JSON.parse(storedUser).name || '';
      } catch {
        name = '';
      }
    }
    setUserName(name);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access media library is required!');
      }
    };
    init();
  }, []);

  const pickMedia = async (type: 'image' | 'video') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia({ uri: result.assets[0].uri, type });
    }
  };

  const uploadMedia = async (): Promise<{ imageUrl: string; videoUrl: string }> => {
    if (!media) return { imageUrl: '', videoUrl: '' };

    const formData = new FormData();
    const uriParts = media.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append(media.type === 'image' ? 'image' : 'video', {
      uri: media.uri,
      name: `upload.${fileType}`,
      type: media.type === 'image' ? `image/${fileType}` : `video/${fileType}`,
    } as any);

    const endpoint =
      media.type === 'image'
        ? 'http://172.20.10.14:3000/api/posts/upload-image'
        : 'http://172.20.10.14:3000/api/posts/upload-video';

   const response = await axios.post(endpoint, formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
   },
  });

    return media.type === 'image'
      ? { imageUrl: response.data.imageUrl, videoUrl: '' }
      : { imageUrl: '', videoUrl: response.data.videoUrl };
  };

  const handlePost = async () => {
    if (!caption.trim()) {
      return Alert.alert('Please enter a caption');
    }

    setUploading(true);

    try {
      const { imageUrl, videoUrl } = await uploadMedia();

  const postData = {
  user_name:userName,  // Get from app's logged-in user info
  type: videoUrl ? 'video' : imageUrl ? 'image' : 'blog',
  content: caption || '',      // Text content of post
  videoUrl: videoUrl || '',
  imageUrl: imageUrl || ''
};
      await axios.post('http://172.20.10.14:3000/api/posts', postData);

      Alert.alert('Post created successfully');
      setMedia(null);
      setCaption('');
      router.push('/');
    } catch (error: any) {
  if (axios.isAxiosError(error)) {
    console.error('Axios error during post creation:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });

    Alert.alert(
      'Post Failed',
      error.response?.data?.error ||
        `Server responded with status ${error.response?.status}: ${error.message}`
    );
  } else {
    console.error('Unexpected error during post creation:', error);
    Alert.alert('Post Failed', 'An unexpected error occurred. See logs for details.');
  }
}
 finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        ぷ Cheza
        <Text style={{ color: '#000' }}>Link</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#666"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {media &&
        (media.type === 'image' ? (
          <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
        ) : (
          <Video
            source={{ uri: media.uri }}
            style={styles.mediaPreview}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
          />
        ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.pickButton} onPress={() => pickMedia('image')}>
          <Text style={styles.pickButtonText}>📸 Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickButton} onPress={() => pickMedia('video')}>
          <Text style={styles.pickButtonText}>🎥 Video</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.postButtonWrapper, uploading && { opacity: 0.7 }]}
        onPress={handlePost}
        disabled={uploading}
      >
        <LinearGradient
          colors={['#00FF00', '#000000']} // 💚 Green to Black
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.postButton}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1db954',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  mediaPreview: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 14,
    backgroundColor: '#eeeeee',
    borderRadius: 12,
    alignItems: 'center',
  },
  pickButtonText: {
    fontWeight: 'bold',
    color: '#111',
  },
  postButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  postButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});