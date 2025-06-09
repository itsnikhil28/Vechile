-- Step 1: Add the new column as nullable
ALTER TABLE "TestDriveBooking" ADD COLUMN "idProof" TEXT;

-- Step 2: Populate existing rows with a default value
UPDATE "TestDriveBooking" SET "idProof" = 'TEMP_PLACEHOLDER_ID';

-- Step 3: Make the column required (NOT NULL)
ALTER TABLE "TestDriveBooking" ALTER COLUMN "idProof" SET NOT NULL;