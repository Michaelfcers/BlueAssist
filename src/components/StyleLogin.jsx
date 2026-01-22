import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  topDecor: {
    height: height * 0.35,
    backgroundColor: '#32a852',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -10,
    height: 100, // Fixed height for cropping
    overflow: 'hidden', // Hide the top part
    justifyContent: 'flex-end', // Align bottom part to show
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginTop: -40, // Shift image up to cut off text
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#32a852', // Primary green
    textAlign: 'center',
    marginBottom: 5,
    marginTop: -10,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24, // Reduced slightly to emphasize App Name
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButton: {
    backgroundColor: '#32a852',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#32a852",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#32a852',
    fontSize: 14,
    fontWeight: '600',
  }
});

export default styles;
