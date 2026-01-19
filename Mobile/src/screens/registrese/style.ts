import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND_BODY,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.SPACING.PADDING_PAGE,
  },
  card: {
    backgroundColor: THEME.COLORS.BACKGROUND_CARD,
    width: '100%',
    maxWidth: 380,
    padding: 30,
    borderRadius: THEME.SPACING.RADIUS_CARD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: THEME.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12, // Aumenta o respiro entre um campo e outro
  },
  input: {
    backgroundColor: THEME.COLORS.BACKGROUND_INPUT,
    color: THEME.COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: THEME.COLORS.PRIMARY,
    padding: 15,
    borderRadius: THEME.SPACING.RADIUS_BUTTON,
    alignItems: 'center',
    marginTop: 30, // Dá destaque ao botão de ação principal
  },
  buttonText: {
    color: THEME.COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});