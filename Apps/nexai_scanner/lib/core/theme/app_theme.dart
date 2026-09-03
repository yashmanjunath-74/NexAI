import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Emerald & Teal Core
  static const Color primary = Color(0xFF48977F);
  static const Color primaryDark = Color(0xFF2F6852);
  static const Color primaryLight = Color(0xFFE8F5F1);

  // Surfaces
  static const Color bgBase = Color(0xFFF8FAFC);
  static const Color bgSurface = Color(0xFFFFFFFF);
  static const Color bgDark = Color(0xFF0F172A);
  static const Color cardBorder = Color(0xFFE2E8F0);

  // Accents
  static const Color accentGreen = Color(0xFF10B981);
  static const Color accentBlue = Color(0xFF3B82F6);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color accentRed = Color(0xFFEF4444);

  // Text
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        primary: primary,
        secondary: accentBlue,
        surface: bgSurface,
      ),
      scaffoldBackgroundColor: bgBase,
      textTheme: GoogleFonts.plusJakartaSansTextTheme().copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(fontSize: 28, fontWeight: FontWeight.w800, color: textPrimary),
        titleLarge: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w800, color: textPrimary),
        titleMedium: GoogleFonts.plusJakartaSans(fontSize: 15, fontWeight: FontWeight.w700, color: textPrimary),
        bodyLarge: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w500, color: textPrimary),
        bodyMedium: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w400, color: textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: bgSurface,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 1,
      ),
    );
  }
}
