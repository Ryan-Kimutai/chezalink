const {
  createBaseProfile,
  createPlayerProfile,
  createScoutProfile,
  createInstitutionProfile,
  getUserProfileByUsername,
  updatePlayerProfile,
  updateScoutProfile,
  updateInstitutionProfile,
} = require('../services/userprofile.services');

// Create a profile
exports.createProfile = async (req, res) => {
  console.log('🔥 createProfile() hit');
  console.log('👉 Incoming body:', req.body);

  const { user_name, account_type } = req.body;

  if (!user_name || !account_type) {
    console.log('❌ Missing user_name or account_type');
    return res.status(400).json({ message: 'user_name and account_type are required' });
  }

  try {
    await createBaseProfile(user_name, account_type);

    switch (account_type) {
      case 'player':
        await createPlayerProfile(user_name, req.body);
        break;
      case 'scout':
        await createScoutProfile(user_name, req.body);
        break;
      case 'institution':
        await createInstitutionProfile(user_name, req.body);
        break;
      default:
        return res.status(400).json({ message: 'Invalid account_type' });
    }

    console.log(`✅ ${account_type} profile created for ${user_name}`);
    res.status(201).json({ message: `${account_type} profile created successfully` });
  } catch (error) {
    console.error('🔥 Error creating profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  const user_name = req.params.user_name;

  try {
    const profile = await getUserProfileByUsername(user_name);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('❌ Error in getProfile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

console.log('Decoded user:', req.user);

// Update profile
exports.updateProfile = async (req, res) => {
  const user_name = req.user?.user_name;
  const newData = req.body;

  if (!user_name) {
    return res.status(400).json({ message: 'Missing user_name from request' });
  }

  try {
    const existingProfile = await getUserProfileByUsername(user_name);
    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const { account_type } = existingProfile;

    // Use ?? to preserve existing fields if not provided in the request
    let updatedData;
    switch (account_type) {
      case 'player':
        updatedData = {
          first_name: newData.first_name ?? existingProfile.first_name,
          last_name: newData.last_name ?? existingProfile.last_name,
          bio: newData.bio ?? existingProfile.bio,
          county: newData.county ?? existingProfile.county,
          date_of_birth: newData.date_of_birth ?? existingProfile.date_of_birth,
          prefered_foot: newData.prefered_foot ?? existingProfile.prefered_foot,
          position: newData.position ?? existingProfile.position,
        };
        await updatePlayerProfile(user_name, updatedData);
        break;

      case 'scout':
        updatedData = {
          first_name: newData.first_name ?? existingProfile.first_name,
          last_name: newData.last_name ?? existingProfile.last_name,
          bio: newData.bio ?? existingProfile.bio,
          county: newData.county ?? existingProfile.county,
          organization: newData.organization ?? existingProfile.organization,
          experience_years: newData.experience_years ?? existingProfile.experience_years,
          specialization: newData.specialization ?? existingProfile.specialization,
        };
        await updateScoutProfile(user_name, updatedData);
        break;

      case 'institution':
        updatedData = {
          institution_name: newData.institution_name ?? existingProfile.institution_name,
          bio: newData.bio ?? existingProfile.bio,
          county: newData.county ?? existingProfile.county,
          institution_type: newData.institution_type ?? existingProfile.institution_type,
          founded_year: newData.founded_year ?? existingProfile.founded_year,
        };
        await updateInstitutionProfile(user_name, updatedData);
        break;

      default:
        return res.status(400).json({ message: 'Unknown account type' });
    }

    const updatedProfile = await getUserProfileByUsername(user_name);
    res.status(200).json({
      message: `${account_type} profile updated successfully`,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
