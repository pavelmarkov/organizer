import os


def alloc_subfolder(
    save_to_path: str,
    max_files_in_folder: int,
):
    start = max_files_in_folder
    subdir = None
    existing_directories = {}
    for entry in os.listdir(save_to_path):
        full_path = os.path.join(save_to_path, entry)
        if os.path.isdir(full_path):
            num_of_files = len(os.listdir(full_path))
            existing_directories[entry] = num_of_files

    for folder, number_of_files in existing_directories.items():
        if number_of_files >= max_files_in_folder:
            start += max_files_in_folder
            continue
        else:
            subdir = folder
            break

    if not subdir:
        subdir = str(start)

    subdir_path = os.path.join(save_to_path, subdir)
    if not os.path.exists(subdir_path):
        os.makedirs(subdir_path)

    return subdir
