import fsserver.preference as pf

def file_iterator(file_name, chunk_size=pf.FILE_CHUNK_SIZE):
    with open(file_name, mode="rb") as f:
        while True:
            c = f.read(chunk_size)
            if c:
                yield c
            else:
                break